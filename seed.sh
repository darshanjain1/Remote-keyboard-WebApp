#!/bin/bash

# Clear the terminal to provide a clean workspace
clear

# Declare an array of seed file names
SEED_FILES=("01_keyboard_keys.js")

# Function to run a seed file
run_seed() {
  local file="$1"
  local command="yarn knex seed:run --env=development --knexfile=./database/knexFile.js --specific=$file"

  echo -e "\033[1mRunning $file seeds...\033[0m"   # Bold file name
  
  # Run the seed command and capture the exit code, discard output
  $command > /dev/null 2>&1
  local exit_code=$?

  if [ $exit_code -ne 0 ]; then
    # Display failure message in red
    echo -e "\033[1;31m$file seeds error\033[0m"
    exit $exit_code             # Exit the script with the seed command's exit code
  else
    # Display success message for the seed in green
    echo -e "\033[1;32m$file seeds are done\033[0m"
  fi
}

# Loop through the seed files and run them
for file in "${SEED_FILES[@]}"; do
  run_seed "$file"              # Run the seed file
done

# Display a message indicating the script has finished in blue
echo -e "\033[34mScript execution completed.\033[0m"
