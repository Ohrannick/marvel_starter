import { useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../servises/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charFind.scss';

const CharFind = (props) => {
  const [char, setChar] = useState(null);
  const { loading, error, getNameCharacter, clearError } = useMarvelService();

  const oCharLoaded = (char) => {
    console.log('char', char);
    setChar(char);
  };

  const searchName = (name) => {
    clearError();
    console.log('name', name);
    getNameCharacter(name).then(oCharLoaded);
  };

  const errorMessage = error ? (
    <div className='charfind__critical-error'>
      <ErrorMessage />
    </div>
  ) : null;
  // console.log('result', char, char.length);
  const results = !char ? null : char.length > 0 ? (
    <div className='charfind__wrapper'>
      <div className='charfind__success'>
        There is! Visit {char[0].name} page?
      </div>
      <Link to={`/comics/${char[0].id}`} className='button button__secondary'>
        <div className='inner'>To page</div>
      </Link>
    </div>
  ) : (
    <div className='charfind__error'>
      The character was not found. Check the name and try again
    </div>
  );

  return (
    <div className='charfind'>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('This field is required'),
        })}
        onSubmit={({ name }) => {
          searchName(name);
        }}
      >
        <Form>
          <label className='charfind__title' htmlFor='name'>
            Or find a character by name:
          </label>
          <div className='charfind__wrapper'>
            <Field
              type='text'
              id='name'
              name='name'
              className='charfind__wrapper-input'
              placeholder='Enter name'
            />
            <button
              type='submit'
              className='button button__main'
              disabled={loading}
            >
              <div className='inner'>Find</div>
            </button>
          </div>
          <FormikErrorMessage
            component='div'
            className='charfind__error'
            name='name'
          />
        </Form>
      </Formik>
      {results}
      {errorMessage}
    </div>
  );
};

export default CharFind;
