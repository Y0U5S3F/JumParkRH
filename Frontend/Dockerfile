# Use the official NGINX image
FROM nginx:stable-alpine

# Remove the default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your built static files into NGINX's public folder.
# Adjust the source path if your built files are in a subdirectory (e.g., "build")
COPY . /usr/share/nginx/html

# Expose port 80 (NGINX default)
EXPOSE 80

# Start NGINX when the container launches
CMD ["nginx", "-g", "daemon off;"]
