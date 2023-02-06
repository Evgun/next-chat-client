import React from 'react';
import Modal from "./Modal";
import useToggle from "../hooks/useToggle";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import AppContext from "../context/AppContext";
import editUser from "../lib/editUser";
import sendPicture from "../lib/sendPicture";
import Cookie from "js-cookie";
import UploadSVG from "../public/images/upload.svg";

export default function Settings() {
  const { isActive: isOpened, toggle } = useToggle();
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingMedia, setLoadingMedia] = React.useState(false);
  const appContext = React.useContext(AppContext);

  const setOpened = () => {
    toggle();
  };

  return (
    <>
      <button type="button" className="side-menu__some-action" onClick={setOpened}>
        Settings
      </button>
      <Modal isOpened={isOpened} setOpened={setOpened}>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .min(3, 'Too Short!')
              .max(24, 'Too Long!'),
            email: Yup.string()
              .email('Invalid email')
              .min(8, 'Too Short!'),
            password: Yup.string()
              .min(8, 'Too Short!')
              .max(24, 'Too Long!'),
          })}
          onSubmit={(values) => {
            setLoading(true);
            editUser(appContext.user.token, values.username, values.email, values.password)
              .then((res) => {
                appContext.setUser(res.data.user);
                setLoading(false);
                setOpened();
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
              <Form className='settings__form'>
                {err && (
                  <p className="error">{err}</p>
                )}
                <div className='form__container'>
                  <label className='label' htmlFor='username'>
                    Your username
                  </label>
                  <div className='input'>
                    <Field
                      placeholder={appContext.user.username}
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
                      placeholder={appContext.user.email}
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
                    {loading ? "Loading... " : "Save"}
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
        <Formik
          initialValues={{
            picture: null,
          }}
          onSubmit={(values) => {
            setLoadingMedia(true);
            sendPicture(appContext.user.token, values.picture)
              .then((res) => {
                appContext.setUser(res.data.user);
                appContext.setChats(res.data.chat.result);
                appContext.setUnread(res.data.chat.count);
                appContext.setLastMessage(res.data.chat.lastMessage);
                localStorage.setItem('token', res.data.user.token);
                Cookie.set('token', res.data.user.token);
                setErr('');
                setLoadingMedia(false);
              })
              .catch((error) => {
                setErr(error.response.data)
                setLoadingMedia(false);
              });
          }}
        >
          {({ dirty, values, setFieldValue }) => (
            <>
              <Form className='photo-form'>
                <div className='photo-form__container'>
                  <input
                    disabled={loadingMedia}
                    className='photo-form__input'
                    type="file"
                    id="picture"
                    name="picture"
                    onChange={(e) => {
                      setFieldValue('picture', e.currentTarget.files[0]);
                    }}
                  />
                  <label htmlFor="picture">
                    <UploadSVG />
                    {values.picture ? values.picture.name : "Choose avatar…"}
                  </label>
                  <button
                    disabled={!(dirty && !loadingMedia)}
                    type='submit'
                    className="btn photo-form__action-btn"
                  >
                    {loadingMedia ? "Loading... " : "Send"}
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}