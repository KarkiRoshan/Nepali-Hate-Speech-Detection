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


def main(video_id,counter):
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
        mains = driver.find_elements(By.XPATH,'//div[@class="style-scope ytd-watch-flexy"]//ytd-comments//div[@id="contents"]//div[@id="comment-content"]')
        # print(main.find_element(By.XPATH,'.//div[@id="comment-content"]'))
        comment_list = []
        for m in mains:
            comment_list.append(m.text)
        
        ss_dir = './Screenshot'
        try:
            os.mkdir(ss_dir)
        except:
            pass
            
        driver.save_screenshot(f"./{ss_dir}/{counter}.png")
        
        csv_dir = './CSV'
        try:
            os.mkdir(csv_dir)
        except:
            pass
        title_list = [title.text]*len(comment_list)
        df = pd.DataFrame(list(zip(title_list,comment_list)))

        df.to_csv(f'./{csv_dir}/result.csv',index=False,header=False,mode='a')
        # for m in mains:
        #     comment = m.find_element(By.XPATH,'.//div[@id="comment-content"]')
        #     print(comment.text)
    except:
        pass

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Video id to search for')
    parser.add_argument('-s','--video_id',nargs='+',default='', type=str,help='Type the key you want to search')   
    parser.add_argument('-c','--count', type=int,help='Type the key you want to search')   
    args = parser.parse_args()
    # print(args.video_id[0])
    # print(args.count)
    video_id = args.video_id[0]
    counter = args.count
    main(video_id,counter)