// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package service

import (
	"context"

	"github.com/coze-dev/cozeloop/backend/modules/evaluation/domain/entity"
)

//go:generate  mockgen -destination  ./mocks/expt_manage.go  --package mocks . IExptManager
type IExptManager interface {
	IExptConfigManager
	IExptExecutionManager
}

// IExptConfigManager 实验配置管理接口（负责实验元数据的增删改查）
type IExptConfigManager interface {
	CheckName(ctx context.Context, name string, spaceID int64, session *entity.Session) (bool, error)

	CreateExpt(ctx context.Context, req *entity.CreateExptParam, session *entity.Session) (*entity.Experiment, error)

	Update(ctx context.Context, expt *entity.Experiment, session *entity.Session) error
	Delete(ctx context.Context, exptID, spaceID int64, session *entity.Session) error
	MDelete(ctx context.Context, exptIDs []int64, spaceID int64, session *entity.Session) error

	List(ctx context.Context, page, pageSize int32, spaceID int64, filter *entity.ExptListFilter, orders []*entity.OrderBy, session *entity.Session) ([]*entity.Experiment, int64, error)
	ListExptRaw(ctx context.Context, page, pageSize int32, spaceID int64, filter *entity.ExptListFilter) ([]*entity.Experiment, int64, error)
	GetDetail(ctx context.Context, exptID, spaceID int64, session *entity.Session, opts ...entity.GetExptTupleOptionFn) (*entity.Experiment, error)
	MGetDetail(ctx context.Context, exptIDs []int64, spaceID int64, session *entity.Session) ([]*entity.Experiment, error)

	Get(ctx context.Context, exptID, spaceID int64, session *entity.Session) (*entity.Experiment, error)
	MGet(ctx context.Context, exptIDs []int64, spaceID int64, session *entity.Session) ([]*entity.Experiment, error)

	Clone(ctx context.Context, exptID, spaceID int64, session *entity.Session) (*entity.Experiment, error)
}

// IExptExecutionManager 实验执行控制接口（负责实验的运行、监控和状态管理）
type IExptExecutionManager interface {
	CheckRun(ctx context.Context, expt *entity.Experiment, spaceID int64, session *entity.Session, opts ...entity.ExptRunCheckOptionFn) error
	Run(ctx context.Context, exptID, runID, spaceID int64, session *entity.Session, runMode entity.ExptRunMode) error
	RetryUnSuccess(ctx context.Context, exptID, runID, spaceID int64, session *entity.Session) error

	Invoke(ctx context.Context, invokeExptReq *entity.InvokeExptReq) error
	Finish(ctx context.Context, exptID *entity.Experiment, exptRunID int64, session *entity.Session) error

	PendRun(ctx context.Context, exptID, exptRunID int64, spaceID int64, session *entity.Session) error
	PendExpt(ctx context.Context, exptID, spaceID int64, session *entity.Session, opts ...entity.CompleteExptOptionFn) error

	CompleteRun(ctx context.Context, exptID, exptRunID int64, mode entity.ExptRunMode, spaceID int64, session *entity.Session, opts ...entity.CompleteExptOptionFn) error
	CompleteExpt(ctx context.Context, exptID, spaceID int64, session *entity.Session, opts ...entity.CompleteExptOptionFn) error

	LogRun(ctx context.Context, exptID, exptRunID int64, mode entity.ExptRunMode, spaceID int64, session *entity.Session) error
	GetRunLog(ctx context.Context, exptID, exptRunID, spaceID int64, session *entity.Session) (*entity.ExptRunLog, error)
}

//type CreateExptParam struct {
//	WorkspaceID         int64   `thrift:"workspace_id,1,required" frugal:"1,required,i64" json:"workspace_id" form:"workspace_id,required" `
//	EvalSetVersionID    int64   `thrift:"eval_set_version_id,2,optional" frugal:"2,optional,i64" json:"eval_set_version_id" form:"eval_set_version_id" `
//	TargetVersionID     int64   `thrift:"target_version_id,3,optional" frugal:"3,optional,i64" json:"target_version_id" form:"target_version_id" `
//	EvaluatorVersionIds []int64 `thrift:"evaluator_version_ids,4,optional" frugal:"4,optional,list<i64>" json:"evaluator_version_ids" form:"evaluator_version_ids" `
//	Name                string  `thrift:"name,5,optional" frugal:"5,optional,string" form:"name" json:"name,omitempty"`
//	Desc                string  `thrift:"desc,6,optional" frugal:"6,optional,string" form:"desc" json:"desc,omitempty"`
//	EvalSetID           int64   `thrift:"eval_set_id,7,optional" frugal:"7,optional,i64" json:"eval_set_id" form:"eval_set_id" `
//	TargetID            *int64  `thrift:"target_id,8,optional" frugal:"8,optional,i64" json:"target_id" form:"target_id" `
//	// TargetFieldMapping    *TargetFieldMapping                `thrift:"target_field_mapping,20,optional" frugal:"20,optional,TargetFieldMapping" form:"target_field_mapping" json:"target_field_mapping,omitempty"`
//	// EvaluatorFieldMapping []*EvaluatorFieldMapping           `thrift:"evaluator_field_mapping,21,optional" frugal:"21,optional,list<EvaluatorFieldMapping>" form:"evaluator_field_mapping" json:"evaluator_field_mapping,omitempty"`
//	// ItemConcurNum         int32                        `thrift:"item_concur_num,22,optional" frugal:"22,optional,i32" form:"item_concur_num" json:"item_concur_num,omitempty"`
//	// EvaluatorsConcurNum   int32                        `thrift:"evaluators_concur_num,23,optional" frugal:"23,optional,i32" form:"evaluators_concur_num" json:"evaluators_concur_num,omitempty"`
//	CreateEvalTargetParam *entity.CreateEvalTargetParam `thrift:"create_eval_target_param,24,optional" frugal:"24,optional,eval_target.CreateEvalTargetParam" form:"create_eval_target_param" json:"create_eval_target_param,omitempty"`
//	ExptType              entity.ExptType               `thrift:"expt_type,30,optional" frugal:"30,optional,ExptType" form:"expt_type" json:"expt_type,omitempty"`
//	MaxAliveTime          int64                         `thrift:"max_alive_time,31,optional" frugal:"31,optional,i64" form:"max_alive_time" json:"max_alive_time,omitempty"`
//	SourceType            entity.SourceType             `thrift:"source_type,32,optional" frugal:"32,optional,SourceType" form:"source_type" json:"source_type,omitempty"`
//	SourceID              string                        `thrift:"source_id,33,optional" frugal:"33,optional,string" form:"source_id" json:"source_id,omitempty"`
//
//	ExptConf *entity.EvaluationConfiguration
//}
//
//type ExptRunCheckOption struct {
//	CheckBenefit bool
//}
//
//type ExptRunCheckOptionFn func(*ExptRunCheckOption)
//
//func WithCheckBenefit() ExptRunCheckOptionFn {
//	return func(e *ExptRunCheckOption) {
//		e.CheckBenefit = true
//	}
//}
//
//type CompleteExptOption struct {
//	Status        entity.ExptStatus
//	StatusMessage string
//	CID           string
//}
//
//type CompleteExptOptionFn func(*CompleteExptOption)
//
//func WithStatus(status entity.ExptStatus) CompleteExptOptionFn {
//	return func(c *CompleteExptOption) {
//		c.Status = status
//	}
//}
//
//func WithStatusMessage(msg string) CompleteExptOptionFn {
//	return func(c *CompleteExptOption) {
//		const maxLen = 200
//		if len(msg) > maxLen {
//			msg = msg[:maxLen]
//		}
//		c.StatusMessage = msg
//	}
//}
//
//func WithCID(cid string) CompleteExptOptionFn {
//	return func(c *CompleteExptOption) {
//		c.CID = cid
//	}
//}
//
//type GetExptTupleOption struct {
//	WithoutDeleted bool
//}
//
//type GetExptTupleOptionFn func(*GetExptTupleOption)
//
//func WithoutTupleDeleted() GetExptTupleOptionFn {
//	return func(c *GetExptTupleOption) {
//		c.WithoutDeleted = true
//	}
//}
