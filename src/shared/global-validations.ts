import { Joi } from 'express-validation';

export class GlobalValidations {
  constructor() {}

  validString(prop: string, maxChar: number) {
    return Joi.string()
      .required()
      .trim()
      .strict()
      .min(1)
      .max(maxChar)
      .messages({
        'any.required': `"${prop}" es requerido`,
        'string.empty': `"${prop}" es requerido`,
        'string.base': `"${prop}" debe ser texto'`,
        'string.min': `"${prop}" debe estar en el rango de 1 a ${maxChar} caracteres`,
        'string.max': `"${prop}" debe estar en el rango de 1 a ${maxChar} caracteres`,
        'string.trim': `"${prop}" no permite espacios en blanco`,
      });
  }

  validIdentification(prop: string, maxChar: number) {
    return Joi.string()
      .required()
      .min(maxChar)
      .max(maxChar)
      .messages({
        'any.required': `"${prop}" es requerido`,
        'string.empty': `"${prop}" es requerido`,
        'string.base': `"${prop}" debe ser texto'`,
        'string.min': `"${prop}" debe tener ${maxChar} caracteres`,
        'string.max': `"${prop}" debe tener ${maxChar} caracteres`,
      });
  }

  validStringNoRequired(prop: string, maxChar: number) {
    return Joi.string()
      .min(1)
      .max(maxChar)
      .messages({
        'any.required': `"${prop}" es requerido`,
        'string.empty': `"${prop}" es requerido`,
        'string.base': `"${prop}" debe ser texto'`,
        'string.min': `"${prop}" debe estar en el rango de 1 a ${maxChar} caracteres`,
        'string.max': `"${prop}" debe estar en el rango de 1 a ${maxChar} caracteres`,
      });
  }

  validStringNoMaxLength(prop: string) {
    return Joi.string()
      .min(1)
      .messages({
        'any.required': `"${prop}" es requerido`,
        'string.empty': `"${prop}" es requerido`,
        'string.base': `"${prop}" debe ser texto'`,
      });
  }

  validNumber(prop: string) {
    return Joi.number()
      .required()
      .integer()
      .min(0)
      .messages({
        'any.required': `"${prop}" es requerida`,
        'number.base': `"${prop}" debe ser número`,
      });
  }

  validNumberNoRequired(prop: string) {
    return Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': `"${prop}" debe ser número`,
      });
  }

  validEmail(prop: string) {
    return Joi.string()
      .required()
      .email()
      .messages({
        'any.required': `"${prop}" es requerido`,
        'string.empty': `"${prop}" es requerido`,
        'string.base': `"${prop}" debe contener @ y el .'`,
      });
  }

  validArray(prop: string, obj: object) {
    return Joi.array()
      .required()
      .items(Joi.object(obj))
      .messages({
        'any.required': `"${prop}" es requerido`,
        'array.base': `"${prop}" debe ser un array`,
      });
  }

  validArrayStr(prop: string) {
    return Joi.array()
      .required()
      .items(Joi.string())
      .messages({
        'any.required': `"${prop}" es requerido`,
        'array.base': `"${prop}" debe ser un array de string`,
      });
  }

  validArrayNumber(prop: string) {
    return Joi.array()
      .required()
      .items(Joi.number())
      .messages({
        'any.required': `"${prop}" es requerido`,
        'array.base': `"${prop}" debe ser un array de números`,
      });
  }

  validOptions(prop: string, options: Array<string>, label: string) {
    return Joi.string()
      .required()
      .valid(...options)
      .messages({
        'any.required': `"${prop}" es requerido`,
        'any.only': `"${prop}" debe estar entre: ${label}`,
      });
  }
}
