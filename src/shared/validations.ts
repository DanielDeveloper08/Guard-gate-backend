import { Joi } from 'express-validation';

export class Validations {
  constructor() {}

  validString(propiedad: string, maximoCaracteres: number) {
    return Joi.string()
      .required()
      .trim()
      .strict()
      .min(1)
      .max(maximoCaracteres)
      .messages({
        'any.required': `"${propiedad}" es requerido`,
        'string.empty': `"${propiedad}" es requerido`,
        'string.base': `"${propiedad}" debe ser texto'`,
        'string.min': `"${propiedad}" debe estar en el rango de 1 a ${maximoCaracteres} caracteres`,
        'string.max': `"${propiedad}" debe estar en el rango de 1 a ${maximoCaracteres} caracteres`,
        'string.trim': `"${propiedad}" no permite espacios en blanco`,
      });
  }

  validIdentification(propiedad: string, caracteres: number) {
    return Joi.string()
      .required()
      .min(caracteres)
      .max(caracteres)
      .messages({
        'any.required': `"${propiedad}" es requerido`,
        'string.empty': `"${propiedad}" es requerido`,
        'string.base': `"${propiedad}" debe ser texto'`,
        'string.min': `"${propiedad}" debe tener ${caracteres} caracteres`,
        'string.max': `"${propiedad}" debe tener ${caracteres} caracteres`,
      });
  }

  validStringNoRequired(propiedad: string, maximoCaracteres: number) {
    return Joi.string()
      .min(1)
      .max(maximoCaracteres)
      .messages({
        'any.required': `"${propiedad}" es requerido`,
        'string.empty': `"${propiedad}" es requerido`,
        'string.base': `"${propiedad}" debe ser texto'`,
        'string.min': `"${propiedad}" debe estar en el rango de 1 a ${maximoCaracteres} caracteres`,
        'string.max': `"${propiedad}" debe estar en el rango de 1 a ${maximoCaracteres} caracteres`,
      });
  }

  validStringNoMaxLength(propiedad: string) {
    return Joi.string()
      .min(1)
      .messages({
        'any.required': `"${propiedad}" es requerido`,
        'string.empty': `"${propiedad}" es requerido`,
        'string.base': `"${propiedad}" debe ser texto'`,
      });
  }

  validNumero(propiedad: string) {
    return Joi.number()
      .required()
      .integer()
      .min(0)
      .messages({
        'any.required': `"${propiedad}" es requerida`,
        'number.base': `"${propiedad}" debe ser número`,
      });
  }

  validEmail(propiedad: string) {
    return Joi.string()
      .required()
      .email()
      .messages({
        'any.required': `"${propiedad}" es requerido`,
        'string.empty': `"${propiedad}" es requerido`,
        'string.base': `"${propiedad}" debe contener @ y el .'`,
      });
  }
}
