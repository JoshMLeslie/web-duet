# Go Server
Provides built files as well as ws handling

## Running
Can be run directly w/ `go` or hot-reloaded w/ `air` from root

> N.b. using `air` will create a `/server/tmp` dir

## Import flow
main <- server <- routes <- services <- classes, util