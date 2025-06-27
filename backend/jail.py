from get_flag import get_flag
from execute_code import execute_code

you_cant_type = ["import", "print", "exec", "eval", "open", "os", "sys"]
# you_cant_type = []

flag = get_flag()

def jail(input_string):
    for keyword in you_cant_type:
        if keyword in input_string:
            return {
            'stdout': "",
            'stderr': "偵測到禁用字詞!",
            'returncode': -1,
            'success': False,
            'timed_out': False
            }
        
    
    return(execute_code(input_string))
