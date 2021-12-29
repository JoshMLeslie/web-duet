package util

import "time"

const (
	WriteTimeMax    = 10 * time.Second
	ReadTimeMax     = 60 * time.Second
	PingTimeMax     = (ReadTimeMax * 9) / 10 // Must be less than pongWait
	MaxMessageBytes = 512
)

var (
	Newline = []byte{'\n'}
	Space   = []byte{' '}
)
