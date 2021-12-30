package services

import (
	"path"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func AppServeHandler(ctx *gin.Context) {
	dir, file := path.Split(ctx.Request.RequestURI)
	ext := filepath.Ext(file)
	if ext == "" {
		ctx.File("dist/index.html")
	}

	if dir == "" {
		ctx.File("dist/index.html")
	} else {
		ctx.File("dist" + path.Join(dir, file))
	}
}
