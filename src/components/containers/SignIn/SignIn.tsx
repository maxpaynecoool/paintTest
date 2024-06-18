import { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ERoutesNames } from '../../../types/router.ts';
import useGoogleAuth from '../../../hooks/useGoogleAuth.ts';
import { useForm } from 'react-hook-form';
import { FormValues } from '../../../types/types.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../../../constants/formSchema.ts';
import { signIn } from '../../../api/auth.ts';
import { showSuccessSignIn } from '../../views/Toasts/showSuccessSignIn.ts';
import { showErrorSignIn } from '../../views/Toasts/showErrorSignIn.ts';
import { Loader } from '../../views/Loader/Loader.tsx';
import { FormContainer, PasswordHelperText } from './SignIn.styles.ts';
import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';

export const SignIn: FC = memo(() => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { googleAuth } = useGoogleAuth();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onBlur', resolver: yupResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setError('');
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      showSuccessSignIn();
    } catch (e) {
      setError((e as Error).message);
      showErrorSignIn(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return (
    <>
      <FormContainer>
        <Container maxWidth="sm">
          <Typography sx={{ m: 2 }} align="center" component="h2" variant="h3">
            Sign in to your account
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <TextField
              color="primary"
              variant="outlined"
              type="email"
              label="Email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              fullWidth
              sx={{ mb: 2 }}
              {...register('email')}
            />
            <FormControl fullWidth error={!!errors.password}>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                {...register('password')}
              />
              <PasswordHelperText>
                {errors?.password?.message}
              </PasswordHelperText>
            </FormControl>
            <Button
              fullWidth
              sx={{ mt: 2, p: 1.5 }}
              type="submit"
              variant="contained"
            >
              <LoginIcon />
              <Typography>Sign In</Typography>
            </Button>
            <Button
              fullWidth
              sx={{ mt: 2, p: 1.5 }}
              variant="contained"
              type="submit"
              onClick={googleAuth}
            >
              {<GoogleIcon />}
            </Button>
            <Typography align="center" mt={2}>
              Dont have an account yet?{' '}
              <Link to={ERoutesNames.SIGN_UP}>Sign up.</Link>
            </Typography>
          </form>
        </Container>
      </FormContainer>
    </>
  );
});

SignIn.displayName = 'SignIn';
