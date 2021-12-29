package classes

import "github.com/google/uuid"

// Maintains active clients & broadcasts to them
type Room struct {
	Id       string
	Clients  map[*Client]struct{}
	incMsg   chan []byte
	regReq   chan *Client
	unregReq chan *Client
}

func NewRoom() *Room {
	return &Room{
		Id:       uuid.NewString(),
		incMsg:   make(chan []byte),
		regReq:   make(chan *Client),
		unregReq: make(chan *Client),
		Clients:  make(map[*Client]struct{}),
	}
}

func (room *Room) run() {
	for {
		select {
		case client := <-room.regReq:
			room.add(client)
		case client := <-room.unregReq:
			if _, ok := room.Clients[client]; ok {
				room.remove(client)
				close(client.send)
			}
		case message := <-room.incMsg:
			for client := range room.Clients {
				select {
				case client.send <- message:
				default:
					room.remove(client)
					close(client.send)
				}
			}
		}
	}
}

func (r *Room) add(c *Client) {
	r.Clients[c] = struct{}{}
}

func (r *Room) register(c *Client) {
	r.regReq <- c
}

func (r *Room) has(c *Client) bool {
	_, ok := r.Clients[c]
	return ok
}

func (r *Room) size() int {
	return len(r.Clients)
}

func (r *Room) remove(c *Client) {
	delete(r.Clients, c)
}

func (r *Room) clear() {
	r.Clients = make(map[*Client]struct{})
}
