package utils

import (
	"strconv"
	"strings"
)

func StrArrToInt(arr []string) ([]int, error) {
	var intArr = make([]int, len(arr))
	for i, s := range arr {
		intval, err := strconv.Atoi(strings.Trim(s, " "))
		if err != nil {
			return nil, err
		}
		intArr[i] = intval
	}
	return intArr, nil
}

func MustStrArrToint(arr []string) []int {
	intArr, err := StrArrToInt(arr)
	if err != nil {
		panic(err)
	}
	return intArr
}

func Contains(arr []string, item string) bool {
	for _, x := range arr {
		if x == item {
			return true
		}
	}
	return false
}

func MustAtoi(s string) int {
	n, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return n
}

func Filter(arr []string, condition func(string) bool) []string {
	var newArr []string
	for _, s := range arr {
		if condition(s) {
			newArr = append(newArr, s)
		}
	}
	return newArr
}

func MapI2S(arr []int, f func(int) string) []string {
	newArr := make([]string, len(arr))
	for i, s := range arr {
		newArr[i] = f(s)
	}
	return newArr
}
