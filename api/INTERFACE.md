# API PROPOSAL

[Template](https://gist.github.com/iros/3426278)

**Basic Functionality**

+ Retrieve single node *(GET)*
+ Retrieve all nodes of a certain type (filterable) *(GET)*
+ Rank a node as a user *(POST)*
+ Map a connection between two nodes *(POST)*

**Retrieve Entity Data**
----
  Retrieve data associated with a specific `Value|Objective|Policy|Issue|Community` entity.
  
* **URL**

  + `/value?id=integer`
  + `/objective?id=integer`
  + `/policy?id=integer`
  + `/issue?id=integer`
  + `/community?id=integer`

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{ keys : values }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "error message" }`




**Retrieve All Data for an Entity type**
----
  Retrieve all entities of a specific type
  `Values|Objectives|Policies|Issues|Communities)`.
  
* **URL**

  + `/values`
  + `/objectives?issue_id=integer`
  + `/policies?issue_id=integer`
  + `/issues?community_id=integer`
  + `/communities`

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
    + For `/objectives` or `/policies` requests `issue_id=[integer]` param is required
    + For `/issues` requests `community_id=[integer]` param is required

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{ nodes : [ { id : [integer], ... }, ... ] }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "error message" }`
    



**Rank an Entity**
----
  Assign a user rank to an entity `Value|Objective|Policy|Issue`.
  
* **URL**

  + `/rank`

* **Method:**
  
  `POST`
  
* **Data Params**

  ```
  {
      user_id: [integer],
      issue_id: [integer],
      entity_id: [integer], // can be `Value|Objective|Policy|Issue` entity
      rank: [integer]
  }
  ```
  
* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{ }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "error message" }`




**Map two Entities**
----
  Create a user map between two entities `Value->Objective|Objective->Policy`.
  
* **URL**

  + `/map`

* **Method:**
  
  `POST`
  
* **Data Params**

  ```
  {
      user_id: [integer],
      issue_id: [integer],
      type: [1|2],  // 1 == Value -> Objective, 2 == Objective -> Policy
      src_id: [integer],
      dest_id: [integer]
  }
  ```
  
* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{ }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "error message" }`




