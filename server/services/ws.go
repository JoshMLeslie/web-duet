package services

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	c "github.com/joshmleslie/web-duet/server/classes"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Rooms map[string]*c.Room

var rooms = make(Rooms)

func WsHandler(ctx *gin.Context) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	query, joinRoom := ctx.GetQuery("roomId")
	var client *c.Client

	if err != nil {
		log.Println("Could not establish ws conn", err)
		return
	}

	if room, hasRoom := rooms[query]; joinRoom && hasRoom {
		client = c.NewClient(room, conn)
	} else {
		room := c.NewRoom()
		rooms[room.Id] = room
		client = c.NewClient(room, conn)
	}

	go client.WritePump()
	go client.ReadPump()
}
