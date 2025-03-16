# # # Frontend - Build stage
# # FROM node:20 AS frontend-build
# # WORKDIR /app
# # COPY ./scientific-library-front/ ./ 
# # RUN npm install
# # RUN npm run dev

# # # Frontend - Serve stage
# # FROM nginx:alpine AS frontend
# # WORKDIR /usr/share/nginx/html
# # COPY --from=frontend-build /app/build .
# # CMD ["nginx", "-g", "daemon off;"]
# # Frontend - Build stage
# FROM node:20 AS frontend-build
# WORKDIR /app

# # Copy frontend source code
# COPY ./ ./  

# # Install dependencies
# RUN npm install

# # Build the project for production (fixing `npm run dev` issue)
# RUN npm run build

# # Frontend - Serve stage
# FROM nginx:alpine AS frontend
# WORKDIR /usr/share/nginx/html

# WORKDIR /app
# RUN ls -la
# # Copy built frontend files from previous stage
# COPY --from=frontend-build /app/dist . 
# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
# Frontend - Build stage
FROM node:20 AS frontend-build
WORKDIR /app

# ✅ Copy frontend source code
COPY ./ ./  

# ✅ Install dependencies
RUN npm install

# ✅ Build the project for production
RUN npm run build || (echo "Build failed! Check Vite config." && exit 1)

# ✅ Debugging: List files after build
RUN ls -l /app/dist

# Frontend - Serve stage
FROM nginx:alpine AS frontend
WORKDIR /usr/share/nginx/html

# ✅ Ensure Nginx folder exists
RUN mkdir -p /usr/share/nginx/html

# ✅ Copy built frontend files from previous stage
COPY --from=frontend-build /app/dist .  
# ✅ Ensure correct Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
