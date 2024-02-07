'use client';
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Checkbox, Input, Link } from '@nextui-org/react';
import { passwordStrength } from 'check-password-strength';
import { error } from 'console';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';
import PasswordStrength from './PasswordStrength';
import { registerUser } from '@/lib/authActions';
import { toast } from 'react-toastify';

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be atleast 2 characters')
      .max(45, 'First name must be less than 45 characters')
      .regex(new RegExp('^[a-zA-Z]+$'), 'No special character allowed!'),
    lastName: z
      .string()
      .min(2, 'Last name must be atleast 2 characters')
      .max(45, 'Last name must be less than 45 characters')
      .regex(new RegExp('^[a-zA-Z]+$'), 'No special character allowed!'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .refine(validator.isMobilePhone, 'Please enter a valid phone number!'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: 'Please accept all terms',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password doesn't match!",
    path: ['confirmPassword'],
  });

type InputType = z.infer<typeof FormSchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisiblePassword = () => setIsVisiblePassword((prev) => !prev);
  const [passStrength, setPassStrength] = useState(0);

  const handleSaveUser: SubmitHandler<InputType> = async (data) => {
    const { confirmPassword, accepted, ...user } = data;
    try {
      const result = await registerUser(user);
      toast.success('The User Registered Successfully');
    } catch (error) {
      toast.error('Something Went Wrong');
      console.error(error);
    }
  };

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);
  return (
    <form
      onSubmit={handleSubmit(handleSaveUser)}
      className='grid grid-cols-2 gap-3  p-2 place-self-stretch shadow border rounded-md'
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        label='First Name'
        startContent={<UserIcon className='w-4' />}
        {...register('firstName')}
      />
      <Input
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        label='Last Name'
        startContent={<UserIcon className='w-4' />}
        {...register('lastName')}
      />
      <Input
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        className='col-span-2'
        label='Email'
        startContent={<EnvelopeIcon className='w-4' />}
        {...register('email')}
      />
      <Input
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        className='col-span-2'
        label='Phone'
        startContent={<PhoneIcon className='w-4' />}
        {...register('phone')}
      />
      <Input
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        className='col-span-2'
        label='Password'
        type={isVisiblePassword ? 'text' : 'password'}
        startContent={<KeyIcon className='w-4' />}
        {...register('password')}
        endContent={
          isVisiblePassword ? (
            <EyeSlashIcon
              className='w-4 cursor-pointer'
              onClick={toggleVisiblePassword}
            />
          ) : (
            <EyeIcon
              className='w-4 cursor-pointer'
              onClick={toggleVisiblePassword}
            />
          )
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        className='col-span-2'
        type={isVisiblePassword ? 'text' : 'password'}
        {...register('confirmPassword')}
        label='Confirm Password'
        startContent={<KeyIcon className='w-4' />}
      />
      <Controller
        control={control}
        name='accepted'
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className='col-span-2'
          >
            I Accept The <Link href='/terms'>Terms</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className='text-red-500'>{errors.accepted.message}</p>
      )}
      <div className='flex justify-center col-span-2'>
        <Button className='w-48' color='primary' type='submit'>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
