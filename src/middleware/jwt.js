import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

/**
 * Extracts and verifies a JWT token from the Authorization header.
 *
 * This is not a traditional Express middleware - it's called inside
 * Apollo Server's context function on every request. The result is
 * attached to the GraphQL context, making the user available in all resolvers.
 *
 * Usage in resolvers:
 *   createReading: (parent, args, context) => {
 *     if (!context.user) throw new GraphQLError('Unauthorized', ...)
 *   }
 *
 * @param {Object} req - Express request object
 * @returns {{ user: Object|null }} - Decoded user payload, or null if no/invalid token
 */
export function getUser(req) {
  // Get the Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization || ''

  // If no header provided, return null (user is not authenticated)
  // Resolvers decide whether to reject or allow unauthenticated requests
  if (!authHeader.startsWith('Bearer ')) {
    return null
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(' ')[1]

  try {
    // Verify the token using the secret from .env
    // If valid, returns the decoded payload: { userId: '...', iat: ..., exp: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (err) {
    // Token is invalid or expired - return null rather than throwing
    // The resolver will throw the appropriate error
    return null
  }
}

/**
 * Throws a GraphQL 401 error if the request is not authenticated.
 * Call this at the top of any resolver that requires authentication.
 *
 * @param {Object} context - GraphQL context object
 * @throws {GraphQLError} 401 Unauthorized if no user in context
 */
export function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        status: 401
      }
    })
  }
}
