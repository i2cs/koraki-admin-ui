import { AuthenticateModule } from './authenticate.module';

describe('AuthenticateModule', () => {
  let authenticateModule: AuthenticateModule;

  beforeEach(() => {
    authenticateModule = new AuthenticateModule();
  });

  it('should create an instance', () => {
    expect(authenticateModule).toBeTruthy();
  });
});
