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
type Clients map[string]*c.Client

type JoinReturn struct {
	roomExists bool
	roomId     string
}

var rooms = make(Rooms)
var clients = make(Clients)

func WsJoinHandler(ctx *gin.Context) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	query, joinRoom := ctx.GetPostForm("roomId")
	var client *c.Client

	if err != nil {
		log.Println("Could not establish ws conn", err)
		ctx.JSON(200, &JoinReturn{
			roomExists: false,
			roomId:     "",
		})
		return
	}

	room, roomExists := rooms[query]
	if joinRoom && roomExists {
		client = c.NewClient(room, conn)
	} else {
		room := c.NewRoom()
		rooms[room.Id] = room
		client = c.NewClient(room, conn)
	}

	go client.WritePump()
	go client.ReadPump()
	clients[client.Id] = client
	ctx.JSON(200, &JoinReturn{
		roomExists: roomExists,
		roomId:     client.Room.Id,
	})
}
