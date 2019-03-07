FROM golang:1.12-alpine as builder
ARG UPX_VERSION=3.95

WORKDIR /app

# Cache the fetched Go packages
RUN apk add --no-cache gcc git musl-dev
COPY ./go.mod ./go.sum ./
RUN go mod download

# Then build the binary
COPY ./ ./

RUN go build

FROM alpine:3.9 as release
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/nomad-parametric-autoscaler ./

CMD ["/app/nomad-parametric-autoscaler"]
