package com.lifehub.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                logger.debug("Extracted username from JWT: " + username);
            } catch (ExpiredJwtException e) {
                // Expired tokens are expected and not an error - log at debug level
                logger.debug("JWT token expired: " + e.getMessage());
            } catch (Exception e) {
                // Log other JWT parsing errors (malformed tokens, invalid signatures, etc.)
                logger.error("JWT parsing error for request: " + request.getRequestURI(), e);
            }
        } else {
            logger.debug("No Authorization header found for request: " + request.getRequestURI());
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                logger.debug("Attempting to load user details for: " + username);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                logger.debug("User details loaded successfully for: " + username);

                logger.debug("Validating token for user: " + username);
                if (jwtUtil.validateToken(jwt, username)) {
                    logger.debug("Token validated successfully for user: " + username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set in SecurityContext for user: " + username);
                } else {
                    logger.warn("Token validation failed for user: " + username + " on request: " + request.getRequestURI());
                }
            } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                logger.error("User not found: " + username + " - This should not happen if token was just issued", e);
            } catch (Exception e) {
                logger.error("Error loading user details or validating token for username: " + username + " on request: " + request.getRequestURI(), e);
                logger.error("Exception type: " + e.getClass().getName());
                logger.error("Exception message: " + e.getMessage());
                if (e.getCause() != null) {
                    logger.error("Caused by: " + e.getCause().getClass().getName() + " - " + e.getCause().getMessage());
                }
            }
        } else if (username == null) {
            logger.debug("Username is null, skipping authentication for request: " + request.getRequestURI());
        } else {
            logger.debug("Authentication already exists in SecurityContext for request: " + request.getRequestURI());
        }
        chain.doFilter(request, response);
    }
}



