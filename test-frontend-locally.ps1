# Temporary script to test frontend locally with EC2 backend
# This avoids the mixed content error

cd frontend

# Set the API URL to your EC2 backend
$env:REACT_APP_API_URL="http://54.206.75.196"

# Install dependencies if needed
# npm install

# Start development server
npm start

# Your app will run on http://localhost:3000 and can call http://54.206.75.196 without mixed content error
