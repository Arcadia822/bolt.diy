import { createOpenAI } from '@ai-sdk/openai';
import { describe, expect, it } from 'vitest';
import { withAgentStreamDeadlines, withAgentToolCallRecovery } from './agent-stream';

/*
 * `wrapLanguageModel` with empty middleware returns the `asLanguageModelV4`
 * shim, whose `provider` lives on the prototype. A bare `{...shim}` spread
 * drops it, and the SDK's `model.provider.split(".")` then throws on the
 * first agent-mode model call ("Cannot read properties of undefined"). The
 * shim shape is exactly what `@ai-sdk/openai`'s `createOpenAI().chat()`
 * returns, so a real instance is used rather than a fake.
 */
describe('agent stream model wrappers', () => {
  const model = createOpenAI({ baseURL: 'http://127.0.0.1:9/v1', apiKey: 'test-key' }).chat('gpt-4o');

  it('withAgentStreamDeadlines preserves the shim provider', () => {
    expect(withAgentStreamDeadlines(model).provider).toBe(model.provider);
  });

  it('withAgentToolCallRecovery preserves the shim provider', () => {
    expect(withAgentToolCallRecovery(model, () => undefined).provider).toBe(model.provider);
  });
});
