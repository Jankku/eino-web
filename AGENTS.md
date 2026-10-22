# Agent guidelines

```
# Always lint and typecheck after editing files
npm run lint
npm run typecheck
```

- Create unit tests only for specific logic that requires it, such as custom hooks or utility functions
- Do not create e2e tests as the tests are out of date