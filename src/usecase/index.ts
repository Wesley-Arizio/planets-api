export interface IUseCase<Response, Args = void> {
  execute(args: Args): Promise<Response>;
}
