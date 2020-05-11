import Joi from '@hapi/joi'

// Password requires one upper and lowercase letter and one digit

const username = Joi.string().min(3).max(128).trim().required()

const email = Joi.string().email().max(128).lowercase().trim()

const password = Joi.string().min(8).max(72, 'utf8')
.regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u).message('"{#label}" must contain at least one uppercase and one lowercase letter, and one digit').required()

const passwordConfirmation = Joi.valid(Joi.ref('password')).required()

const validUserSchema = Joi.object({
  username,
  email,
  password,
  passwordConfirmation,
})    

// { value, error, warning } can be destructured from validate
export const validate = async (inputObj: object) => {
  try {
    const value = await validUserSchema.validateAsync(inputObj, {abortEarly: false})
    console.log(value)
    return value
  }
  catch (err) { 
    return {
      message: err
    }
  }
} 