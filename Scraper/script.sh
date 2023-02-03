#!/bin/bash

counter = 0 
while IFS= read -r line || [[ -n "$line" ]]; do
  # Pass the line as an argument to the Python script
    echo "$line"
    #((counter++))
    #echo $counter
    #python main.py -s "$line" -c $counter
#   python script.py --arg "$line"
done < "./Video_id.txt"
