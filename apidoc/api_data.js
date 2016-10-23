define({ "api": [
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Request User information by users id",
    "name": "GetUser",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Users id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Created username.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/users/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "Register an account",
    "name": "Register",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "username",
            "description": "<p>Unique username. Must be an email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success or not</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Returned data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data._id",
            "description": "<p>Users id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.username",
            "description": "<p>Created username.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/users/register"
      }
    ]
  }
] });
