3. Testing the Endpoints
   After implementing the above code, you can test the following endpoints using a tool like Postman or CURL:

For Conductor:

# POST /api/conductors/register: 
To register a new conductor (body: { "name": "John Doe", "employeeId": "C123", "contactNumber": "1234567890", "password": "securepassword" })
POST /api/conductors/login: To log in an existing conductor (body: { "employeeId": "C123", "password": "securepassword" })
For Driver:

# POST /api/conductors/login: 
To register a new driver (body: { "name": "Jane Doe", "employeeId": "D123", "contactNumber": "0987654321", "password": "securedriverpassword" })
POST /api/drivers/login: To log in an existing driver (body: { "employeeId": "D123", "password": "securedriverpassword" })


For Driver:

# POST /api/drivers/register: 
To register a new conductor (body: { "name": "John Doe", "employeeId": "C123", "contactNumber": "1234567890", "password": "securepassword" })
POST /api/conductors/login: To log in an existing conductor (body: { "employeeId": "C123", "password": "securepassword" })
For Driver:

# POST /api/drivers/login: 
To register a new driver (body: { "name": "Jane Doe", "employeeId": "D123", "contactNumber": "0987654321", "password": "securedriverpassword" })
POST /api/drivers/login: To log in an existing driver (body: { "employeeId": "D123", "password": "securedriverpassword" })