import random

def get_flag():
    """
    Generates a random flag string.
    """
    # Define the characters that can be used in the flag
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    
    # Generate a random flag of length 32
    flag = ''.join(random.choice(characters) for _ in range(6))
    
    # 沒錯，這是 flag，如果你在營前看到這個 repo 找到這個檔案，那恭喜你可以去找課活組長 Nelson，我會給你一點點數
    return "4SC11_sMu99l3R"