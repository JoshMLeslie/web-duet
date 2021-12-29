// Some code adopted from Gorilla WS. Relevant code is
// Copyright (c) 2013 The Gorilla WebSocket Authors. All rights reserved.

package main

import (
	"flag"
	"log"

	"github.com/joshmleslie/web-duet/server/util"
)

// for reference:
// var w http.ResponseWriter = c.Writer
// var req *http.Request = c.Req

func main() {
	flag.Parse()
	log.SetFlags(0)

	server := StartServer()

	util.HandleSafeQuit(server)
}
