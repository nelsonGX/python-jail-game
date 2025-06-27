from get_flag import get_flag
from execute_code import execute_code

you_cant_type = ["import", "print", "exec", "eval", "open", "os", "sys"]
# you_cant_type = []

def jail(input_string):
    for keyword in you_cant_type:
        input_string = input_string.replace(keyword, "")

    flag = get_flag()
    
    return(execute_code(f"flag = \"{flag}\"\n{input_string}"))
