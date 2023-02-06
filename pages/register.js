import React, { useState, useContext } from "react";
import { registerUser } from "../lib/auth";
import AppContext from "../context/AppContext";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const appContext = useContext(AppContext);

  React.useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/chat");
    }
  }, [appContext]);

  return (
    <>
    <Head>
      <title>
        SignUp
      </title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className="wrapper">
      <Link href="/">
        <img className="fixed-logo link" src='/images/logo.png' alt="text" />
      </Link>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .min(3, 'Too Short!')
            .max(24, 'Too Long!')
            .required('Required'),
          email: Yup.string()
            .email('Invalid email')
            .min(8, 'Too Short!')
            .required('Required'),
          password: Yup.string()
            .min(8, 'Too Short!')
            .max(24, 'Too Long!')
            .required('Required'),
        })}
        onSubmit={(values) => {
          setLoading(true);
          registerUser(values.username, values.email, values.password)
            .then((res) => {
              appContext.setUser(res.data.user);
              appContext.setChats(res.data.chat.result);
              appContext.setUnread(res.data.chat.count);
              appContext.setLastMessage(res.data.chat.lastMessage);
              setLoading(false);
              setErr('');
            })
            .catch((error) => {
              setErr(error.response.data);
              setLoading(false);
            });
        }}
      >
        {({ errors, touched, dirty, isValid }) => (
          <>
            <Form className='form'>
              <div className='header'>
                  <img className='sign-up-logo' alt="logo" src="/images/sign_up.svg" />
                  <div className='header__info'>
                    <h1 className='header__title'>Sign Up</h1>
                    <p className='header__text'>You're Welcome</p>
                  </div>
                  {err && (
                    <p className="error">{err}</p>
                  )}
              </div>
              <div className='form__container'>
                <label className='label' htmlFor='username'>
                  Your username
                </label>
                <div className='input'>
                  <Field
                    disabled={loading}
                    id='username'
                    className={classNames('input__field', {
                      'input__field--error':
                        errors.username && touched.username,
                    })}
                    name='username'
                    type='username'
                  />
                  {errors.username && touched.username ? (
                    <div className='input__error'>
                      {errors.username}
                    </div>
                  ) : null}
                </div>
                <label className='label' htmlFor='email'>
                  Your email
                </label>
                <div className='input'>
                  <Field
                    disabled={loading}
                    id='email'
                    className={classNames('input__field', {
                      'input__field--error':
                        errors.email && touched.email,
                    })}
                    name='email'
                    type='email'
                  />
                  {errors.email && touched.email ? (
                    <div className='input__error'>
                      {errors.email}
                    </div>
                  ) : null}
                </div>
                <label className='label' htmlFor='pass'>
                  Your Password
                </label>
                <div className='input'>
                  <Field
                    disabled={loading}
                    id='pass'
                    className={classNames('input__field', {
                      'input__field--error': errors.password && touched.password,
                    })}
                    name='password'
                    type='password'
                  />
                  {errors.password && touched.password ? (
                    <div className='input__error'>{errors.password}</div>
                  ) : null}
                </div>
                <button
                  className='btn form__action-btn'
                  type='submit'
                  disabled={!(isValid && dirty && !loading)}
                >
                  {loading ? "Loading... " : "Sign Up"}
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
    </>
  );
};

export default Register;
