# Setup

To install backend deps run the following command

```
pip install -r utils/requirements.txt

```

To install frontend deps run the following command

```
cd ui
npm install
```

# Start Servers

To start the backend server, in a terminal tab run the following

```
uvicorn api.index:app --reload
```

To start the frontend in a new terminal run the following

```
cd ui
npm run dev
```


# WIP: provide recommendation product
```
recommend_utils.py
```