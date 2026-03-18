//go:build linux

package main

import (
	"syscall"
	"unsafe"
)

// getTermios retrieves the current terminal attributes for a file descriptor.
func getTermios(fd int) (*syscall.Termios, error) {
	var t syscall.Termios
	_, _, errno := syscall.Syscall(
		syscall.SYS_IOCTL,
		uintptr(fd),
		uintptr(syscall.TCGETS),
		uintptr(unsafe.Pointer(&t)),
	)
	if errno != 0 {
		return nil, errno
	}
	return &t, nil
}

// setTermios applies terminal attributes to a file descriptor.
func setTermios(fd int, t *syscall.Termios) error {
	_, _, errno := syscall.Syscall(
		syscall.SYS_IOCTL,
		uintptr(fd),
		uintptr(syscall.TCSETS),
		uintptr(unsafe.Pointer(t)),
	)
	if errno != 0 {
		return errno
	}
	return nil
}
