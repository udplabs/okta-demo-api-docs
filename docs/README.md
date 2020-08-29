---
home: true
actionText: Get Started
actionLink: /guide/
tagline: The Okta Demo API Platform Service
---

## About

The Okta Demo API is a platform service that answers three basic requirements:

* Provide a useable and dependable RESTful API to use in Okta demos, presentations or other [pre-sales] activities
* Create a solid reference platform for integrating OAuth flows into an API including configuration of an authorization server, scopes/claims inside Okta
* Provide self-contained and "believable" test data sets that are organized by a business type (vertical).

## Usage
### URL
Each request to the API requires this URL structure:
[BaseAPIUrl]/[Tenant Name]/api/[vertical]/[model]
* BaseAPIUrl - deployed location of the API
* Tenant Name - sub domain name from UDP
* Vertical - all models are aligned to a business vertical (hospitality, ecommerce, etc)
* Model - the endpoint/data transfer object to be acted upon

Additionally, the API accepts paging requests in order to limit the number items returned when a collection is requested.  The API limits the total maximum number to be requested at 20 (`okta.demo.api.host.aws.application.settings.APIOptions.MaxPageSize)`.  To control paging, the caller can include two parameters on the query string:
* `Skip` - number of items to skip before returning the next page of data (default 0)
* `Limit` - number of items to return up to the configured maximum or remaining count (default max page size)
### Multi-tenancy
The Okta Demo API respects the concept of multi-tenancy.   A "Tenant" in the API is equivalent to a "Sub Domain" within the Okta UDP.   Each request to the API will act upon data owned by that tenant and it will have visibility only to that tenant.   

As elaborated on more fully in the security section, each request requires a proper access token.   The API will validate the token as expected, but will additionally validate whether or not the token used is mapped to the tenant (UDP Subdomain) requested.   If the token was not minted by the associated Okta org the request will be terminated and the caller will receive an error message identifying this conflict.

Data providers can implement their own multi-tenancy strategy.   In the case of the current PostgreSql implementation, each tenant will be given its own database schema.   Users will be free to view, update, delete all data within their tenant without fear of impacting anyone else.   When ready, the user can then reset their data back to initial state.  See the section on operations in this document.

### Sample Response
The API will return a consistent object for all requests, including those that result in a HTTP response other than 200.

Example response from a request for a single Amenity model:
```json
{
    "successful": true,
    "message": "",
    "data": {
    "name": "21_HOUR_FRONT_DESK",
    "id": "1843900b-c275-46ff-8c77-8029f6e38d03",
    "created": "2020-05-15T14:45:43.803846",
    "modified": "2020-06-22T16:21:23.118192"
    }
}
```
Example response from a request for all Amenities (3 per page):
```json
{
    "successful": true,
    "message": "",
    "data": [
    {
        "name": "24_HOUR_FRONT_DESK",
        "id": "1843900b-c275-46ff-8c77-8029f6e38d03",
        "created": "2020-05-15T14:45:43.803846",
        "modified": "2020-05-15T14:45:43.803846"
    },
    {
        "name": "CORDLESS_PHONE",
        "id": "883ad70a-fedd-47e6-87f7-0070305e56a2",
        "created": "2020-05-15T14:45:43.804502",
        "modified": "2020-05-15T14:45:43.804502"
    },
    {
        "name": "HORSE_RIDING",
        "id": "f592db4f-17cf-49c7-9c18-9a29aa0eb312",
        "created": "2020-05-15T14:45:43.804504",
        "modified": "2020-05-15T14:45:43.804504"
    }
    ],
    "paging": {
    "availableItems": 147,
    "currentPage": 1,
    "totalPages": 49,
    "currentPageSize": 3
    }
}
```

The common response may also include a links property that supplies associative models or actions if they exist. Links are only included if the item returned has relevant associated other objects for the caller.

An example links property is returned on a `GET` to the `/admin/system` endpoint (defined later in this document).
```json
{
    "links": [
    {
        "rel": "DownloadPostmanCollection",
        "uri": "/oktagus-mlm/api/admin/System/download-postman-collection"
    },
    {
        "rel": "DownloadPostmanEnvironment",
        "uri": "/oktagus-mlm/api/admin/System/download-postman-environment"
    },
    {
        "rel": "Reset",
        "uri": "/oktagus-mlm/api/admin/System/reset"
    }
    ]
}
```
