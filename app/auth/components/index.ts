/**
 * @file index.ts
 * @description Barrel file that exports all authentication components.
 * Simplifies imports by providing a single entry point for all auth components.
 */

// Export all authentication components for easier imports
export { default as AuthHeader } from './AuthHeader';
export { default as Button } from './Button';
export { default as FormInput } from './FormInput';
export { default as SignInForm } from './SignInForm';

// Add a default export to satisfy Expo Router
export default {};

