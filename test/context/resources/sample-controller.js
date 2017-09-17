class SampleController {
  constructor(sampleService) {
    this.sampleService = sampleService
  }

  async show(ctx, id) {
    const user = await this.sampleService.findById(id);
    ctx.body = user;
  }
}

module.exports = SampleController;