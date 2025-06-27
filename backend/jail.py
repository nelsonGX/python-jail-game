from get_flag import get_flag
import subprocess

you_cant_type = ["import", "print", "exec", "eval", "open", "os", "sys"]

flag = get_flag()

def jail(input_string):
    for keyword in you_cant_type:
        if keyword in input_string:
            return print("偵測到禁用詞！")
    
    eval(input_string)

jail("print('hi')")