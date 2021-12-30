package services

import (
	"log"
	"net/http"
	"path"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func AppServeHandler(ctx *gin.Context) {
	if ctx.Request.Method != http.MethodGet {
		log.Println(
			"AppServeHandler: not allowed",
			ctx.Request.Method,
			ctx.Request.URL,
		)
		ctx.String(http.StatusMethodNotAllowed, "Not allowed")
		return
	}

	dir, file := path.Split(ctx.Request.RequestURI)
	ext := filepath.Ext(file)
	if file == "" || ext == "" {
		ctx.File("dist/index.html")
	} else {
		path := "dist" + path.Join(dir, file)
		ctx.File(path)
	}
}
