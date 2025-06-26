// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package mysql

import (
	"context"

	"github.com/coze-dev/cozeloop/backend/infra/db"
	"github.com/coze-dev/cozeloop/backend/modules/foundation/infra/repo/mysql/gorm_gen/model"
	"github.com/coze-dev/cozeloop/backend/modules/foundation/infra/repo/mysql/gorm_gen/query"
)

//go:generate mockgen -destination=mocks/user_dao.go -package=mocks . IUserDao
type IUserDao interface {
	Create(ctx context.Context, user *model.User, opts ...db.Option) error
	Save(ctx context.Context, user *model.User, opts ...db.Option) error

	GetByID(ctx context.Context, userID int64, opts ...db.Option) (*model.User, error)
	MGetByIDs(ctx context.Context, userIDs []int64, opts ...db.Option) ([]*model.User, error)
	FindByEmail(ctx context.Context, email string, opts ...db.Option) (*model.User, error)
	FindByUniqueName(ctx context.Context, uniqueName string, opts ...db.Option) (*model.User, error)

	Update(ctx context.Context, userID int64, updates map[string]interface{}, opts ...db.Option) error
}

type UserDaoImpl struct {
	db    db.Provider
	query *query.Query
}

func NewUserDaoImpl(db db.Provider) IUserDao {
	return &UserDaoImpl{
		db:    db,
		query: query.Use(db.NewSession(context.Background())),
	}
}

func (dao *UserDaoImpl) Create(ctx context.Context, user *model.User, opts ...db.Option) error {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))
	return dao.query.User.WithContext(ctx).Create(user)
}

func (dao *UserDaoImpl) Save(ctx context.Context, user *model.User, opts ...db.Option) error {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))
	return dao.query.User.WithContext(ctx).Save(user)
}

func (dao *UserDaoImpl) FindByUniqueName(ctx context.Context, uniqueName string, opts ...db.Option) (*model.User, error) {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))
	return dao.query.User.WithContext(ctx).Where(
		dao.query.User.UniqueName.Eq(uniqueName),
	).First()
}

func (dao *UserDaoImpl) FindByEmail(ctx context.Context, email string, opts ...db.Option) (*model.User, error) {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))

	return dao.query.User.WithContext(ctx).Where(
		dao.query.User.Email.Eq(email),
	).First()
}

func (dao *UserDaoImpl) Update(ctx context.Context, userID int64, updates map[string]interface{}, opts ...db.Option) error {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))

	_, err := dao.query.User.WithContext(ctx).Where(
		dao.query.User.ID.Eq(userID),
	).Updates(updates)

	return err
}

func (dao *UserDaoImpl) GetByID(ctx context.Context, userID int64, opts ...db.Option) (*model.User, error) {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))

	return dao.query.User.WithContext(ctx).Where(
		dao.query.User.ID.Eq(userID),
	).First()
}

func (dao *UserDaoImpl) MGetByIDs(ctx context.Context, userIDs []int64, opts ...db.Option) ([]*model.User, error) {
	dao.query = query.Use(dao.db.NewSession(ctx, opts...))
	return dao.query.User.WithContext(ctx).Where(
		dao.query.User.ID.In(userIDs...),
	).Find()
}
