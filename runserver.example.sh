num_panes=$(tmux list-panes | wc -l)
if [ $num_panes -eq 1 ]; then
  tmux split-window -h
fi
tmux send-keys -t 1 'cd /home/evan/github.com/zingales/theresheep/frontend; yarn start' ENTER &

export DEBUG_DAY_TIME_IN_SECONDS=10
if [ "$1" == "onewerewolf" ]; then
  export DEBUG_ROLE_ORDER="1,2,3,4,5,0"
elif [ "$1" == "seer" ]; then
  export DEBUG_ROLE_ORDER="0,2,3,4,5,1"
else
  export DEBUG_ROLE_ORDER="0,1,2,3,4,5"
fi

go run main.go

