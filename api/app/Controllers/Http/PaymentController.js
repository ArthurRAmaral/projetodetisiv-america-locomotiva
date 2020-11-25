'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {require('@adonisjs/validator/src/Validator/index').validate} */
const { validate } = use('Validator')

const Payment = use('App/Models/Payment')
const Plan = use('App/Models/Plan')
const Database = use('Database')
const moment = require('moment')

/**
 * Resourceful controller for interacting with payments
 */
class PaymentController {
  /**
   * Show a list of all payments.
   * GET payments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const payments = await Payment.query().with('user').with('plan').fetch()

    if (payments) {
      return payments
    }

    return response.notFound()
  }

  async indexPlan({ params, request, response }) {
    const { id } = params

    const payments = await Payment.query()
      .where('plan_id', id)
      .with('user')
      .with('plan')
      .fetch()

    if (payments) {
      return payments
    }

    return response.notFound()
  }

  /**
   * Create/save a new payment.
   * POST payments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['user_id', 'plan_id', 'value', 'due_date'])

    if (!data.value) {
      const plan = await Plan.find(data.plan_id)
      data.value = plan.monthlyPrice
    }

    try {
      await Payment.create(data)
    } catch (error) {
      console.log(error)
      return response.conflict()
    }
    return response.created()
  }

  /**
   * Display a single payment.
   * GET payments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const { id } = params

    const payment = await Payment.query()
      .where({ id })
      .with('user')
      .with('plan')
      .first()

    return payment ? payment : response.notFound()
  }

  /**
   * Update payment details.
   * PUT or PATCH payments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      user_id: 'required|integer',
      plan_id: 'required|integer',
      payment_date: 'date',
      due_date: 'required|date',
      value: 'number',
      paid: 'boolean',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails())
      return response.unprocessableEntity(validation.messages())

    const { id } = params
    const data = request.only([
      'user_id',
      'plan_id',
      'payment_date',
      'due_date',
      'value',
      'paid',
    ])

    const payment = await Payment.query().where({ id }).firstOrFail()

    if (payment) {
      payment.merge(data)
      await payment.save()
      return response.noContent()
    }
    return response.notFound()
  }

  /**
   * Delete a payment with id.
   * DELETE payments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const { id } = params

    const deletedPayment = await Payment.query().where({ id }).delete()

    if (deletedPayment) {
      return response.noContent()
    }

    return response.notFound()
  }

  async generate({ params, request, response }) {
    const { id } = params

    const plan = await Plan.query().where({ id }).with('users').first()
    const allUsers = await Database.from('users').where('plan_id', id)

    if (plan) {
      if (allUsers.length === 0) {
        return response.noContent()
      }

      const { day } = request.only('day')
      const { monthQnt } = request.only('monthQnt')

      const startYear = new Date().getFullYear()
      const startDay = new Date().getDay()
      const startMonth =
        startDay < day ? new Date().getMonth() : new Date().getMonth() + 1

      for (let user of allUsers) {
        let year = startYear
        let month = startMonth
        const createdPayments = await Database.from('payments')
          .where('plan_id', id)
          .where('user_id', user.id)
        for (let i = 0; i < monthQnt; i++) {
          if (month > 11) {
            month = 0
            year++
          }
          const dueDate = new Date(year, month, day)
          const payment = {
            user_id: user.id,
            plan_id: plan.id,
            due_date: dueDate,
            value: plan.monthlyPrice,
          }
          let exist = false
          for (let createdPayment of createdPayments) {
            if (
              createdPayment.due_date.getMonth() ===
                payment.due_date.getMonth() &&
              createdPayment.due_date.getFullYear() ===
                payment.due_date.getFullYear()
            ) {
              exist = true
              break
            }
          }
          if (!exist) {
            Payment.create(payment)
          }
          month++
        }
      }
      return response.created()
    }

    return response.notFound()
  }

  async getExpectations({ response }) {
    const payments = await Payment.query().with('user.teams').fetch()
    let maped = []

    if (payments) {
      const paymentsArray = payments.toJSON()

      const pastDate = new Date()
      pastDate.setMonth(pastDate.getMonth() - 6)
      pastDate.setDate(1)
      pastDate.setHours(0, 0, 0, 0)

      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 5)
      futureDate.setDate(moment(futureDate).daysInMonth())
      futureDate.setHours(0, 0, 0, 0)

      paymentsArray
        .filter((payment) => {
          return moment(payment.due_date)
            .hour(12)
            .isBetween(pastDate, futureDate)
        })
        .map((payment) => {
          const paymentDate = new Date(payment.due_date)
          return {
            value: parseFloat(payment.value),
            isPaid: payment.paid,
            month: paymentDate.getMonth(),
            year: paymentDate.getFullYear(),
            id: payment.id,
            teams: payment.user.teams.map((team) => team.name),
          }
        })
        .sort((a, b) => a.month - b.month)
        .forEach((expectation) => {
          const searchResult = maped.find((item) => {
            let teamsIncludes =
              expectation.teams.length === 0 && item.teams.length === 0
            for (let i = 0; i < expectation.teams.length; i++) {
              if (i === 0) teamsIncludes = true
              teamsIncludes =
                teamsIncludes && item.teams.includes(expectation.teams[i])
            }
            return (
              expectation.isPaid === item.isPaid &&
              expectation.month === item.month &&
              teamsIncludes
            )
          })
          const index = maped.indexOf(searchResult)
          if (index < 0) {
            expectation.references = [expectation.id]
            delete expectation.id
            maped.push(expectation)
          } else {
            const actual = maped[index]
            delete actual.id
            actual.references.push(expectation.id)
            maped[index] = {
              ...actual,
              value: actual.value + expectation.value,
            }
          }
        })

      return response.json(maped)
    }
  }
}

module.exports = PaymentController
