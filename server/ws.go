package main

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

var rooms Rooms = make(map[string]*c.Room)

func WsHandler(ctx *gin.Context) {
	w := ctx.Writer
	r := ctx.Request
	conn, err := upgrader.Upgrade(w, r, nil)
	query, joinRoom := ctx.GetQuery("roomId")
	var client *c.Client

	if err != nil {
		log.Println("Could not establish ws conn", err)
		return
	}

	if joinRoom {
		if room, hasRoom := rooms[query]; hasRoom {
			client = c.NewClient(room, conn)
		} else {
			log.Println("TODO: tried to join missing room")
		}
	} else {
		room := c.NewRoom()
		rooms[room.Id] = room
		client = c.NewClient(room, conn)
	}

	go client.WritePump()
	go client.ReadPump()
}
