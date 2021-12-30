package classes

import (
	"bytes"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	u "github.com/joshmleslie/web-duet/server/util"
)

// Client is a middleman between the websocket connection and the room.
type Client struct {
	id   string
	room *Room
	conn *websocket.Conn
	// Buffered channel of outbound messages.
	send chan []byte
}

func NewClient(room *Room, conn *websocket.Conn) *Client {
	c := &Client{
		id:   uuid.NewString(),
		room: room,
		conn: conn,
		send: make(chan []byte, 256),
	}
	c.room.register(c)
	return c
}

// ReadPump pumps messages from the websocket connection to the room.
//
// The application runs ReadPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) ReadPump() {
	defer func() {
		c.room.unregReq <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(u.MaxMessageBytes)
	c.conn.SetReadDeadline(time.Now().Add(u.ReadTimeMax))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(u.ReadTimeMax))
		return nil
	})
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(
				err,
				websocket.CloseGoingAway, websocket.CloseAbnormalClosure,
			) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, u.Newline, u.Space, -1))
		c.room.incMsg <- message
	}
}

// WritePump pumps messages from the room to the websocket connection.
//
// A goroutine running WritePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) WritePump() {
	ticker := time.NewTicker(u.PingTimeMax)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(u.WriteTimeMax))
			if !ok {
				// The room closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(u.Newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(u.WriteTimeMax))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
