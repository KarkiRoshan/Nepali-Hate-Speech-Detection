## Hate Speech Detetction in Nepali Language

To Do Taks


1. Data Scraping Part
- [x] Scrape data from youtube(Done using selenium)
- [ ] Scrape data from facebook 
- [ ] Scrape data from twitter 
- [ ] Extract resutls from multiple pages
2. Data Transformation and annotation Part
- [ ] Clean the scraped data 
    1. Annotate the data
        - [ ] Set out certain annotation guidelines
    2. Transliterate the data
        - [ ] https://github.com/AI4Bharat/IndicXlit for reference
        - [ ] Create a model to do both back and from transliteration
        - [ ] Transliterate all data to roman
        - [ ] Transliterate all data to devnagari
3. Classification Part 
    Currently look at two different approaches to clasify
    1.  BERT for classification
        - [x] Try Nepali Devnagari BERT models 
        - [ ] Reasearch on Roman BERT models  
    - [ ] FastText for Classification

    (Only binary classication(Hate or Not Hate) for now ) 
4. Web Browser Extension Part
    - [x] Fetch all comments from the broswer(only yt for now)
    - [x] Send fetched comments to the backend
    - [x] modify the webpage according to resp from the backend 

