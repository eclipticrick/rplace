# /r/place NodeJS backend

This is a re-make of the backend for /r/place. If you want to make your own front-end for this you can use this Node API. It has 4 endpoints as described below.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need:
* [NodeJS and NPM](https://nodejs.org/) to install the dependencies for this project
* A [google](https://accounts.google.com/) account to setup your [Firebase](https://firebase.google.com/) backend for this project


### Installing

A step by step series of examples that tell you how to get a development env running

Clone the repo.
```
git clone https://github.com/eclipticrick/rplace.git rplace-clone
```

Install the dependencies in the newly created folder

```
cd rplace-clone
npm install
```

Run the development server locally
```
npm run start
```

The server will be running on [localhost:5002](http://localhost:5002).


## Endpoints

There are 4 endpoints

**<code>GET</code> [localhost:5002/register](http://localhost:5002/register)**

**<code>GET</code> [localhost:5002/pixels](http://localhost:5002/pixels)**

**<code>GET</code> [localhost:5002/time](http://localhost:5002/time)?key=[string]**

**<code>POST</code> [localhost:5002/pixel](http://localhost:5002/pixel)?key=[string]**

##

#### **<code>POST</code> [localhost:5002/register](http://localhost:5002/register)**

register for a key to place pixels with, after registering the first pixel can be set after 300 seconds (this can be changed in ```config.js```)

* **URL**
  /register

* **Method:**
  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
        "key": "abc",
        "": ""
    }
    ```

##

#### **<code>GET</code> [localhost:5002/pixels](http://localhost:5002/pixels)**

set a pixel

* **URL**
  /pixels

* **Method:**
  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    [
      {
        "x": 0,
        "y": 0,
        "color": "#FFFFFF"
      },
      {
        "x": 0,
        "y": 1,
        "color": "#FFFFFF"
      },
      { },
      { },
      { },
      { }
    ]
    ```

* **Sample Call:**

  ```javascript
    
  ```

##

#### **<code>GET</code> [localhost:5002/time](http://localhost:5002/time)?key=[string]**

get time until next possible pixel placement

* **URL**
  /time

* **Method:**
  `GET`
  
*  **URL Params**
   (Required)
   `key=[string]`

##

#### **<code>POST</code> [localhost:5002/pixel](http://localhost:5002/pixel)?key=[string]**

set a pixel

* **URL**
  /pixel

* **Method:**
  `POST`
  
*  **URL Params**
   (Required)
   `key=[string]`

* **Data Params**
   (Required)
   `{ x: [number], y: [number], color: [string] }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: 'success' }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Pixel not found" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Unauthorized." }`

* **Sample Call:**

  ```javascript
    
  ```








## Authors

* **Wesley Veenendaal** - *Initial work* - [Github page](https://github.com/eclipticrick)

See also the list of [contributors](https://github.com/eclipticrick/rplace/contributors) who participated in this project.

## License

###### TODO
