var request = require('supertest');
var app = require('../../../server/server');

var load = require('../../helpers/dataLoad');
var project = load(require('./data/project.json'));

/**
 * プロジェクト一覧が取得できるテストパターン
 * @param  {Function} done
 */
var sucessListProjects = function(done) {
  var url = '/api/projects/list-projects';
  if (this.accessToken) url += '?access_token=' + this.accessToken;
  request(app)
    .get(url)
    .expect(200)
    .expect(project(this), done);
};

describe('ProjectModel Tests', function() {
  var model = app.models.project;
  describe('ゲストユーザーが使用した場合', function() {
    // 正常系パターン
    it('プロジェクトの一覧が取得できる', sucessListProjects);

    // 異常系パターン
    it('プロジェクト詳細の一覧は取得できない', function(done) {
      request(app)
        .get('/api/projects')
        .expect(401, done);
    });
    it('プロジェクト詳細は取得できない', function(done) {
      request(app)
        .get('/api/projects/1')
        .expect(401, done);
    });
    it('プロジェクトの登録はできない', function(done) {
      request(app)
        .post('/api/projects')
        .send(project(this, 'send'))
        .expect(401, done);
    });
    it('プロジェクトの残高は加算できない', function(done) {
      request(app)
        .post('/api/projects/donate')
        .send(project(this, 'send'))
        .expect(401, done);
    });
  });

  describe('管理者ユーザーが使用した場合', function() {
    var _describe = this;
    beforeEach(function(done) {
      var self = this;
      request(app).post('/api/users/login')
        .send(project(_describe, 'login'))
        .end(function(res) {
          self.accessToken = this.res.body.id;
          done();
        });
    });
    // 正常系パターン
    it('プロジェクトの一覧が取得できる', sucessListProjects);
    it('プロジェクト詳細の一覧が取得できる', function(done) {
      request(app)
        .get('/api/projects' + '?access_token=' + this.accessToken)
        .expect(200, done);
    });
    it('プロジェクトの残高を加算できる', function(done) {
      request(app)
        .post('/api/projects/donate' + '?access_token=' + this.accessToken)
        .send(project(this, 'send'))
        .expect(200)
        .expect(project(this, 'expect'), done);
    });

    // 異常系パターン
    it('プロジェクトの登録はできない', function(done) {
      request(app)
        .post('/api/projects' + '?access_token=' + this.accessToken)
        .send(project(this, 'send'))
        .expect(401, done);
    });
  });
});
