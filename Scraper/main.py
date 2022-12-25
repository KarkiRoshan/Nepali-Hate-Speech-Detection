from selenium import webdriver 
import time 
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import argparse
import numpy as np 
import pandas as pd 
import os 
from selenium.webdriver.chrome.options import Options


def main(video_id):
    PATH = "C:\Program Files (x86)\chromedriver.exe" 
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(f"https://www.youtube.com/watch?v={video_id}")
    driver.set_window_size(1550, 926)
    time.sleep(5)
    try:
        element = WebDriverWait(driver,10).until(
            EC.presence_of_element_located((By.XPATH,'//div[@class="style-scope ytd-watch-flexy"]')))
        
        entire_body = driver.find_element(By.TAG_NAME,'html')
        entire_body.send_keys(Keys.PAGE_DOWN)
        time.sleep(5)
        height = driver.execute_script("return document.documentElement.scrollHeight")
        # time.sleep(2)
        title = driver.find_element(By.XPATH,'//div[@class="style-scope ytd-watch-flexy"]//h1')
        i=0
        while(True):
            height_before = driver.execute_script("return document.documentElement.scrollHeight")
            print(height_before)
            time.sleep(1)
            driver.find_element(By.TAG_NAME,'body').send_keys(Keys.END)
            height_after = driver.execute_script("return document.documentElement.scrollHeight")
            if (i!=0) & (height_after==height_before):
                break
            i+=1

        driver.set_window_size(1920, height_after)
        driver.save_screenshot(f"full_page.png")
        main = driver.find_elements(By.XPATH,'//div[@class="style-scope ytd-watch-flexy"]//ytd-comments//div[@id="contents"]//div[@id="comment-content"]')
        # print(main.find_element(By.XPATH,'.//div[@id="comment-content"]'))
        comment_list = []
        for m in main:
            comment_list.append(m.text)
        df = pd.DataFrame()
        df['comments'] = comment_list
        df['Video_Title'] = title.text
        df.to_csv('./hello.csv',index=False)
        # for m in mains:
        #     comment = m.find_element(By.XPATH,'.//div[@id="comment-content"]')
        #     print(comment.text)
    except:
        pass

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Video id to search for')
    parser.add_argument('-s','--video_id',nargs='+',default='', type=str,help='Type the key you want to search')   
    args = parser.parse_args()
    main('YQBPdxpEUy0')