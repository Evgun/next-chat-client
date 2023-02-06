import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/auth";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import AppContext from "../context/AppContext";
import Head from "next/head";
import Link from "next/link";
import LoginSVG from "../public/images/login.svg";

function Login() {
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);
  const [err, setErr] = useState('');
  
  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/chat");
    }
  }, [appContext]);

  const handleCheckBox = (e) => {
    setRemember(e.target.checked)
  }

  return (
    <>
    <Head>
      <title>
        SignIn
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
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={(values) => {
          setLoading(true);
          login(values.email, values.password, remember)
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
                <LoginSVG />
                <div className='header__info'>
                  <h1 className='header__title'>Login</h1>
                  <p className='header__text'>Welcome back</p>
                </div>
                {err && (
                  <p className="error">{err}</p>
                )}
              </div>
              <div className='form__container'>
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
                <label className='input-checkbox'>
                  <input type='checkbox' checked={remember} onChange={handleCheckBox} />
                  <span>Remember me</span>
                </label>
                <button
                  className='btn form__action-btn'
                  type='submit'
                  disabled={!(isValid && dirty && !loading)}
                >
                  {loading ? "Loading... " : "Login"}
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
    </>
  );
}

export default Login;