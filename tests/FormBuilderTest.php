<?php

namespace AwesIO\FormBuilder\Tests;

use AwesIO\FormBuilder\FormBuilder;
use InvalidArgumentException;

class FormBuilderTest extends AbstractTestCase
{
    public function test_validate_method_lowerStr()
    {
		$this->assertEquals('some text', (new FormBuilder)->lowerStr('Some Text'));
    }
}
