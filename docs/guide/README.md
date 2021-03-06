---
sidebarDepth: 0
---
# Verify Terraform actions

Verify that UDP terraformed the following items in your Org:

## OIDC Client
An OIDC Application named **okta-demo-api (Generated by UDP)**
  * with `redirect_uri`: `https://localhost:5001/signin-oidc`

## Authorization server
 An authorization server named **okta-demo-api (Generated by UDP)**
 - with the following custom scopes: `system`, `ecommerce`, `financial`, and `hospitality`
 - with the following custom claims: `system.permissions,` `ecommerce.permissions`, `financial.permissions`, and `hospitality.permissions`
 - with an access policy that allows **All Clients**

## Groups

A total of 26 groups were created. The  group names are: prefixed with `okta.demo.api` followed by one of the custom scopes, followed by a permission (either `view` or `manage`), and ending with a scope specific property.

For example, there are two groups for the `system` scope, one to manage and one to view, the `admin` property:
  - `okta.demo.api.system.manage.admin`
  - `okta.demo.api.system.view.admin`

There are also:
- Ten eCommerce groups to manage or view: `Category`, `Facet`, `Offer`, `Product`, and `Shipper`
- Four Financial groups to manage or view: `Branch` and `Member`
- Twelve Hospitality groups to manage or view: `Amenity`, `Brand`, `Hoteloffer`, `Memberstay`, `Property`,and `Rewardsmember`,

## Group Memberships
The username supplied for the **Groups' default user** input variable should have been added as member of all the Groups above.
